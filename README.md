# Sample E-commerce API Created with NodeJS, ExpressJS, and MongoDB

### Installation

```sh
npm install
```

### Running the Development Server

```sh
npm run dev
```

## USER ROUTES

### 1. Register a User (POST) 
**Endpoint:** `{{url}}/users/register`

**Request:**
- **Request Body Fields:**
  - `firstName`
  - `lastName`
  - `email`
  - `mobileNo`
  - `address`
  - `password`

**Response:**
- Returns the registered user info

### 2. Login User (POST) 
**Endpoint:** `{{url}}/users/login`

**Request:**
- **Request Body Fields:**
  - `email`
  - `password`

**Response:**
- Returns an access token

### 3. Retrieve User Details (GET) 
**Endpoint:** `{{url}}/users/details`

**Request:**
- Requires authentication

**Response:**
- Returns the logged user's info

### 4. Retrieve All Users (GET) 
**Endpoint:** `{{url}}/users/all`

**Request:**
- Requires authentication and admin privileges

**Response:**
- Returns all users and their info

### 5. Update User (PUT) 
**Endpoint:** `{{url}}/users/:userId/update`

**Request:**
- Requires authentication and admin privileges
- **Request Body Fields (at least one of the following):**
  - `firstName`
  - `lastName`
  - `email`
  - `mobileNo`
  - `address`

**Response:**
- Returns updated user info

### 6. Delete User (DELETE) 
**Endpoint:** `{{url}}/users/delete`

**Request:**
- Requires authentication and admin privileges
- **Request Body:**
  - `userId`

**Response:**
- Returns deleted user info

### 7. Set User Privileges (POST) 
**Endpoint:** `{{url}}/users/set-user-privileges`

**Request:**
- Requires authentication and admin privileges
- **Request Body:**
  - `userId`
  - `isAdmin`

**Response:**
- Returns updated user info

## PRODUCTS ROUTES

### 1. Add Product as Admin (POST) 
**Endpoint:** `{{url}}/products/add-product-admin`

**Request:**
- Requires authentication and admin privileges
- **Request Body:**
  - `productName`
  - `description`
  - `price`
  - `stocks`

**Response:**
- Returns added product name and ID

### 2. Add Product as Seller (POST) 
**Endpoint:** `{{url}}/products/add-product-seller`

**Request:**
- Requires authentication and seller privileges
- **Request Body:**
  - `productName`
  - `description`
  - `price`
  - `stocks`

**Response:**
- Returns added product name and ID

### 3. Retrieve All Products (GET) 
**Endpoint:** `{{url}}/products/all`

**Request:**
- None

**Response:**
- Returns all products

### 4. Retrieve All Active Products (GET) 
**Endpoint:** `{{url}}/products/active`

**Request:**
- None

**Response:**
- Returns active products

### 5. Retrieve a Product (GET) 
**Endpoint:** `{{url}}/products/:productId/details`

**Request:**
- None

**Response:**
- Returns product details

### 6. Update a Product (PUT) 
**Endpoint:** `{{url}}/products/:productId/update`

**Request:**
- Requires authentication and admin privileges
- **Request Body (at least one of the following):**
  - `productName`
  - `description`
  - `price`
  - `stocks`

**Response:**
- Returns updated product info

### 7. Archive Product (PUT) 
**Endpoint:** `{{url}}/products/:productId/archive`

**Request:**
- Requires authentication and admin privileges

**Response:**
- Returns archived product name and ID

### 8. Add Review to a Product (POST) 
**Endpoint:** `{{url}}/products/:productId/add-review`

**Request:**
- Requires authentication
- Must have bought the product and haven't posted any reviews of the product yet
- **Request Body:**
  - `rating`
  - `comment`

**Response:**
- Returns posted review

## CART ROUTES

### 1. Add Item to Cart (POST) 
**Endpoint:** `{{url}}/cart/add-to-cart`

**Request:**
- Requires authentication
- **Request Body:**
  - `productId`
  - `quantity`

**Response:**
- Returns added item in the cart

### 2. Retrieve Cart Items (GET) 
**Endpoint:** `{{url}}/cart/my-cart`

**Request:**
- Requires authentication

**Response:**
- Returns all items in the cart

### 3. Remove Cart Items (PUT) 
**Endpoint:** `{{url}}/cart/remove-cart-items`

**Request:**
- Requires authentication
- **Request Body:**
  - `cartItem` - Array of cart item IDs

**Response:**
- Returns current cart items

## ORDER ROUTES

### 1. Check Out Products (POST) 
**Endpoint:** `{{url}}/orders/check-out`

**Request:**
- Requires authentication
- **Request Body:** (Two options)
  - **Option 1:** Check out items from cart
    - `cartItemId` - Array of cart item IDs
  - **Option 2:** Directly check out from the product page
    - `productId` - Array of product IDs
    - `quantity` - Array of quantities
  - *Note: Both arrays must match in length and each index must correspond to a single check out*

**Response:**
- Returns ordered products

### 2. Retrieve Ordered Products (GET) 
**Endpoint:** `{{url}}/orders/my-orders`

**Request:**
- Requires authentication

**Response:**
- Returns all ordered products of the logged user

### 3. Retrieve All Orders (GET) 
**Endpoint:** `{{url}}/orders/all`

**Request:**
- Requires authentication and admin privileges

**Response:**
- Returns all ordered products from all users

## SELLER ROUTES

### 1. Register Seller (POST) 
**Endpoint:** `{{url}}/sellers/register-seller`

**Request:**
- Requires authentication and admin privileges
- **Request Body:**
  - `userId`
  - `sellerName`

**Response:**
- Returns registered seller info

### 2. Retrieve All Sellers (GET) 
**Endpoint:** `{{url}}/sellers/all`

**Request:**
- None

**Response:**
- Returns all sellers

### 3. Retrieve Seller Details (GET) 
**Endpoint:** `{{url}}/sellers/:sellerId/details`

**Request:**
- None
- \[OPTIONAL\] Requires authentication and admin privileges to get complete information

**Response:**
- Returns seller info

