import {ApolloServer, gql} from "apollo-server"

let tweets = [
    {
        id:"1",
        text:"first one",
        userId:"2",
    },
    {
        id:"2",
        text:"second one",
        userId:"1",
    },
]

let users = [
    {
        id:"1",
        firstName:"hyoim",
        lastName:"kim",
    },
    {
        id:"2",
        firstName:"ara",
        lastName:"go",
    },
]

//gql`SDL`
//type Query 는 필수
//Scalar Type : String, Int, Boolean, ID
const typeDefs = gql`
    """
    Is the sum of firstName + lastName
    """
    type User {
        id:ID!
        firstName:String!
        lastName:String!
        fullName:String!
    }
    """
    Tweet object represents a resource for a Tweet
    """
    type Tweet {
        id:ID!
        text:String!
        auther: User
    }
    type Query {
        allTweets: [Tweet!]!
        allUsers: [User!]!
        tweet(id:ID!): Tweet
        allMovies: [Movie!]!
        movie(id:String!): Movie
    }
    type Mutation {
        postTweet(text:String!, userId:ID!): Tweet!
        """
        Deletes a Tweet if found, else return false
        """
        deleteTweet(id:ID!): Boolean!
    }
    type Movie {
        id: Int!
        url: String!
        imdb_code: String!
        title: String!
        title_english: String!
        title_long: String!
        slug: String!
        year: Int!
        rating: Float!
        runtime: Float!
        genres: [String]!
        summary: String
        description_full: String!
        synopsis: String
        yt_trailer_code: String!
        language: String!
        background_image: String!
        background_image_original: String!
        small_cover_image: String!
        medium_cover_image: String!
        large_cover_image: String!
    }
`
/*
GraphQL
type Query {
    text: String
    hello:String
}
REST api
GET /text
GET /hello

type Mutation {
    tweet
}
POST /tweet

REST api 에서 url 을 만드는 것이 GraphQL에서는 type 을 만드는것과 같음.
GraphQL에서는 REST의 POST 같은 것은 모두 Mutation 타입에 넣는다.
type 뒤에 ! 가 붙으면 required가 된다.
*/

//결과값을 주는 객체.
//파라미터는 항상 root, args 순서로 args에 유저가 보낸 파라미터가 들어있다.
//root에는 GraphQL이 탐색한 데이터가 파라미터 형식으로 들어있다.
//typeDef 에서 type 으로 정의된 모든것은 resolvers 에 만들 수 있다.
//query나 mutation 뿐만 아니라 User, Tweet 도 resolvers 안에 들어갈 수 있다.
const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        },
        tweet(root, {id}) {
            return tweets.find(tweet => tweet.id === id);
        },
        allUsers() {
            console.log("allUser called!");
            return users;
        },
        allMovies() {
            return fetch("https://yts.mx/api/v2/list_movies.json")
            .then(res => res.json())
            .then(json => json.data.movies);
        },
        movie(root, {id}) {
            return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
            .then(res => res.json())
            .then(json => json.data.movie);
        }
    },
    Mutation: {
        postTweet(root, {text, userId}) {
            const newTweet = {
                id: tweets.length + 1,
                text,
                userId,
            }
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(root, {id}) {
            const tweet = tweets.find((tweet) => tweet.id === id);
            if(!tweet) {
                return false;
            } else {
                //tweets.splice(tweets.findIndex(tweet => tweet.id === id), 1);
                tweets = tweets.filter((tweet) => tweet.id !== id);
                return true;
            }
        },
    },
    User: {  
        fullName({firstName, lastName}) {
            return `${firstName} ${lastName}`;
        }
    },
    Tweet: {
        auther({userId}) {
            return users.find(user => user.id === userId);
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
})