**Zuitt Coding Bootcamp Capstone 2: E-commerce API**

**Routes Requests Documentation**

Created by: Clark

**To install:**

`npm install`

**To run dev server:**

`npm run dev`



**USER ROUTES**

1\. Register a user(POST) {{url}}/users/register

>Request:

>request body fields:

-   firstName

-   lastName

-   email

-   mobileNo

-   address

-   password

>Response:

>returns sa the registered user info

2\. Login user(POST) {{url}}/users/login

> Request:
>
> request body fields:

-   email

-   password

> Response:
>
> it will return an access token

3\. Retrieve user details(GET) {{url}}/users/details

> Request:
>
> requires auth
>
> Response:
>
> it will return the logged user's info

4\. Retrieve all users(GET) {{url}}/users/all

> Request:
>
> requires auth and needs to be admin
>
> Response:
>
> returns all the users and their info

5\. Update users(PUT) {{url}}/users/:userId/update

> Request:
>
> requires auth and needs to be admin
>
> request body fields (at least one of the following):

-   firstName

-   lastName

-   email

-   mobileNo

-   address

> Response:
>
> returns updated users and their info

6\. Delete user(DELETE) {{url}}/users/delete

> Request:
>
> requires auth and needs to be admin
>
> request body:

-   userId

> Response:
>
> returns deleted users

7\. Set user privilege(POST) {{url}}/users/set-user-privileges

> Request:
>
> requires auth and needs to be admin
>
> request body:

-   userId

-   isAdmin

> Response:
>
> returns updated user

**PRODUCTS ROUTES**

1\. Add product as admin(POST) {{url}}/products/add-product-admin

> Request:
>
> requires auth and needs to be admin
>
> request body:

-   productName

-   description

-   price

-   stocks

> Response:
>
> returns added product name and id

2\. Add product as admin(POST) {{url}}/products/add-product-seller

> Request:
>
> requires auth and needs to be a seller
>
> request body:

-   productName

-   description

-   price

-   stocks

> Response:
>
> returns added product name and id

3\. Retrieve all products(GET) {{url}}/products/all

> Request:
>
> none
>
> Response:
>
> returns all products

4\. Retrieve all active products(GET) {{url}}/products/active

> Request:
>
> none
>
> Response:
>
> returns active products

5\. Retrieve a product(GET) {{url}}/products/:productId/details

> Request:
>
> none
>
> Response:
>
> returns active products

6\. Update a product(PUT) {{url}}/products/:productId/update

> Request:
>
> requires auth and needs to be admin
>
> request body (at lease one of the following):

-   productName

-   description

-   price

-   stocks

> Response:
>
> returns updated product

7\. Archive product(PUT) {{url}}/products/:productId/archive

> Request:
>
> requires auth and needs to be admin
>
> Response:
>
> returns added product name and id

8\. Update a product(POST) {{url}}/products/:productId/add-review

> Request:
>
> requires auth
>
> must have bought the product and haven't posted any reviews of the
> product yet
>
> request body:

-   rating

-   comment

> Response:
>
> returns posted review

**CART ROUTES**

1\. Add item to cart(POST) {{url}}/cart/add-to-cart

> Request:
>
> requires auth
>
> request body:

-   productId

-   quantity

> Response:
>
> returns carted item

2\. Retrieve cart items(GET) {{url}}/cart/my-cart

> Request:
>
> requires auth
>
> Response:
>
> returns all carted items

3\. Remove cart items(PUT) {{url}}/cart/remove-cart-items

> Request:
>
> requires auth
>
> request body:

-   cartItem -- Array of cart item ids

> Response:
>
> returns current cart items

**ORDER ROUTES**

1.Check out products(POST) {{url}}/orders/check-out

> Request:
>
> requires auth
>
> request body:
>
> There are two options:
>
> Option 1 -- if you check out items from cart
>
> Option 2 -- if you directly check out from the product page
>
> Option 1 request body:

-   cartItemId -- Array of cart item ids

Option 2 request body:

-   productId -- Array of product ids

-   quantity -- Array of quantities

*note: both arrays must match in length*

*each index must correspond to a single check out*

> Response:
>
> returns ordered products

2.Retrieve ordered products(GET) {{url}}/orders/check-out

> Request:
>
> requires auth
>
> Response:
>
> returns all ordered products of the logged user

3.Retrieve ordered products(GET) {{url}}/orders/check-out

> Request:
>
> requires auth and must be an admin
>
> Response:
>
> returns all ordered products from all users

**SELLER ROUTES**

1\. Set user as Seller(POST) {{url}}/sellers/register-seller

> Request:
>
> requires auth and needs to be admin
>
> request body:

-   userId

-   sellerName

> Response:
>
> returns registered seller

2\. Retrieve all seller(GET) {{url}}/sellers/all

> Request:
>
> none
>
> Response:
>
> returns all seller

3\. Retrieve seller details(GET) {{url}}/sellers/:sellerId/details

> Request:
>
> requires none
>
> \[OPTIONAL\] requires auth and needs to be admin to get the complete
> information
>
> Response:
>
> returns seller info
