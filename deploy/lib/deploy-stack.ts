import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
const { aws_lambda: lambda, aws_apigateway: apigateway, aws_s3: s3 } = cdk;

export class DeployStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const bucket = new Bucket(this, "DivvyBikeStationsData", {
			// HACK: Independently deployable across accounts, but not deployable more than once per account.
			// TODO: Use the stack ID here. Have to extract the UUID from the end of `this.stackId`.
			bucketName: `divvy-bikes-stations-data-${this.account}`,
			publicReadAccess: true,
			blockPublicAccess: new s3.BlockPublicAccess({
				blockPublicAcls: false,
				ignorePublicAcls: false,
				blockPublicPolicy: false,
				restrictPublicBuckets: false,
			}),
		});

		const lambdaFunction = new lambda.Function(
			this,
			"DivvyBikeStationsFunction",
			{
				runtime: lambda.Runtime.NODEJS_20_X,
				code: lambda.Code.fromAsset("../aws-dist"),
				handler: "lambda.handler",
				environment: { BUCKET_NAME: bucket.bucketName },
				timeout: cdk.Duration.seconds(30),
			},
		);

		bucket.grantPut(lambdaFunction);

		const integration = new apigateway.LambdaIntegration(lambdaFunction);
		const api = new apigateway.RestApi(this, "DivvyBikeStationsAPI");
		api.root.addMethod("GET", integration);
	}
}
