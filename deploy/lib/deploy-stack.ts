import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

const { aws_lambda: lambda, aws_apigateway: apigateway } = cdk;

export class DeployStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const lambdaFunction = new lambda.Function(this, "DivvyBikesStations", {
			runtime: lambda.Runtime.NODEJS_20_X,
			code: lambda.Code.fromAsset("../aws-dist"),
			handler: "lambda.handler",
			timeout: cdk.Duration.seconds(30),
		});

		const integration = new apigateway.LambdaIntegration(lambdaFunction);
		const api = new apigateway.RestApi(this, "DivvyBikesStationsAPI");
		api.root.addMethod("GET", integration);
	}
}
