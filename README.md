# 🚀 Nest Contentful

This is a testing project to collect products info from Contentful API using NestJS and TypeORM.

## 📋 Requirements

### 🐳 Containers

- Docker or Podman
- Docker-compose or podman compose
- Copy the `.env.example` file into `.env` and set your environment, you can leave them as it is but you need to change these:
  - `CONTENTFUL_SPACE_ID`
  - `CONTENTFUL_ACCESS_TOKEN`
  - `CONTENTFUL_ENVIRONMENT`
  - `CONTENTFUL_CONTENT_TYPE`

## 🏃‍♂️ Getting Started

Now you can run this project with:

```bash
# Docker
$ docker-compose up -d

# Podman
$ podman compose --file docker-compose.yml up -d
```

This will get your project up and running! 🎉

## 📖 Usage

⏰ Every hour the products will be fetched automatically, after that you can use the API endpoints with this [Postman workspace](https://web.postman.co/workspace/9fa99f95-aad4-4d7d-8b50-948371de1016)

### 🔗 API Endpoints

> **Note:** Default baseURL is `http://localhost:3000`

#### 🔍 Search Products

**GET** – `{{baseURL}}/products/search`

Find fetched products from Contentful ([Postman request](https://www.postman.com/navigation-candidate-47055367/workspace/contentful-test-api/request/15771358-be557407-e90f-491a-9395-a65aeffcb8f0?action=share&source=copy-link&creator=15771358))

#### 🗑️ Delete Product

**DELETE** – `{{baseURL}}/products/:id`

Delete a specific product by ID ([Postman request](https://www.postman.com/navigation-candidate-47055367/workspace/contentful-test-api/request/15771358-f73a5f0a-a3f1-475b-a76c-5d9bc110d258?action=share&source=copy-link&creator=15771358))

#### 🔒 📊 Deleted Products Percentage

**GET** – `{{baseURL}}/products-reports/deleted-percentage`

View deleted products analytics report ([Postman request](https://www.postman.com/navigation-candidate-47055367/workspace/contentful-test-api/request/15771358-85390f29-5705-4337-9456-b3d1d46f1b9a?action=share&source=copy-link&creator=15771358))

#### 🔒 📈 Products Percentage

**GET** – `{{baseURL}}/products-reports/percentage`

View general products statistics report ([Postman request](https://www.postman.com/navigation-candidate-47055367/workspace/contentful-test-api/request/15771358-298477a4-4f50-46df-9e11-d01a0f389739?action=share&source=copy-link&creator=15771358))

#### 🔒 🏷️ Products by Categories

**GET** – `{{baseURL}}/products-reports/categories`

View products breakdown by category ([Postman request](https://www.postman.com/navigation-candidate-47055367/workspace/contentful-test-api/request/15771358-298477a4-4f50-46df-9e11-d01a0f389739?action=share&source=copy-link&creator=15771358))
