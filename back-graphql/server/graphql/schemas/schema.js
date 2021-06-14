module.exports = `
    type User {
        id: ID
        name: String!
        email: String!
        password: String!
        profilePhoto: String
        cart: [CartItem]
    }

    type Category {
        id: ID,
        name: String!
        products: [Product]
    }

    type Product {
        id: ID
        name: String
        price: Float
        images: [String]
        mainImage: String
        description: String
        seller: User
        status: String
        quantity: Int
        category: Category
        reviews: [Review]
        reviewsCount: Int
        averageRating: Float
    }

    type Review {
        id: ID
        author: User
        rating: Int
        text: String
        date: String
    }

    type CartItem {
        id: ID,
        item: Product,
        quantity: Int
    }

    type Notification {
        ok: Boolean,
        message: String
    }

    type LogIn {
        user: User,
        token: String,
        status: Notification
    }

    type Query {
        user(id: ID!): User 
        product(id: ID!): Product 
        category(id: ID!): Category 
        users: [User]
        products: [Product]
        categories: [Category]
        login(email: String!, password: String!): LogIn
        search(filters: String!): [Product]
    }

    type Mutation {
        addUser (
            name: String
            email: String
            password: String
            profilePhoto: String
        ): Notification
        addCategory(
            name: String!
        ):Category
        addProduct(
            name: String
            price: Float
            quantity: Int
            description: String
            seller: ID
            category: ID
            images: String
        ):Product
        addReview(
            authorId: ID
            productId: ID
            rating: Int
            text: String
        ):Notification
        addItemToCart(
            userId: ID
            productId: ID
            quantity: Int
        ):Notification
        purchaseCartItems(
            items: String
        ):Notification
        removeUser(
            id: ID!
        ):User
        removeCategory(
            id: ID! 
        ):Notification
        removeProduct(
            id: ID! 
        ):Product
        removeProductFromCart(
            userId: ID
            productId: ID
        ):Notification
    }

    schema {
        query: Query,
        mutation: Mutation
    }
`;
