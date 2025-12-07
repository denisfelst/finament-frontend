SWAGGER:

To generate TS Swagger Generated API Client:

locally:

NODE_TLS_REJECT_UNAUTHORIZED=0 npx openapi-typescript-codegen \
 --input https://localhost:7001/swagger/v1/swagger.json \
 --output src/app/api \
 --client angular
