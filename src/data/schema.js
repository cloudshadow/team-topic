import crypto from 'crypto';
import moment from 'moment';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { PubSub, withFilter } from 'graphql-subscriptions';
import sequelize from './sequelize';
import { UserModel, TeamModel, UserTeamModel, PostModel } from './models';

const pubsub = new PubSub();

const User = new GraphQLObjectType({
  name: 'User',
  description: 'User',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve (user) {
          return user.id;
        }
      },
      username: {
        type: GraphQLString,
        resolve (user) {
          return user.username;
        }
      },
      password: {
        type: GraphQLString,
        resolve (user) {
          return user.password;
        }
      },
      role: {
        type: GraphQLInt,
        resolve (user) {
          return user.role;
        }
      },
      updatetime: {
        type: GraphQLString,
        resolve (user) {
          return moment(user.updatetime).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      createtime: {
        type: GraphQLString,
        resolve (user) {
          return moment(user.createtime).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      teams: {
        type: new GraphQLList(Team),
        resolve (user) {
          return user.getTeams();
        }
      }
    };
  }
});

const Team = new GraphQLObjectType({
  name: 'Team',
  description: 'Team',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve (team) {
          return team.id;
        }
      },
      name: {
        type: GraphQLString,
        resolve (team) {
          return team.name;
        }
      },
      updatetime: {
        type: GraphQLString,
        resolve (team) {
          return moment(team.updatetime).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      createtime: {
        type: GraphQLString,
        resolve (team) {
          return moment(team.createtime).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      users: {
        type: new GraphQLList(User),
        resolve (team) {
          return team.getUsers();
        }
      },
      posts: {
        type: new GraphQLList(Post),
        resolve (team) {
          return team.getPosts();
        }
      }
    }
  }
});

const UserTeam = new GraphQLObjectType({
  name: 'UserTeam',
  description: 'UserTeam',
  fields: () => {
    return {
      user_id: {
        type: GraphQLInt,
        resolve (userTeam) {
          return userTeam.user_id;
        }
      },
      team_id: {
        type: GraphQLInt,
        resolve (userTeam) {
          return userTeam.team_id;
        }
      },
    }
  }
});

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'Post',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve (post) {
          return post.id;
        }
      },
      team_id: {
        type: GraphQLInt,
        resolve (post) {
          return post.team_id;
        }
      },
      author: {
        type: GraphQLString,
        resolve (post) {
          return post.author;
        }
      },
      title: {
        type: GraphQLString,
        resolve (post) {
          return post.title;
        }
      },
      desc: {
        type: GraphQLString,
        resolve (post) {
          return post.desc;
        }
      },
      zindex: {
        type: GraphQLInt,
        resolve (post) {
          return post.zindex;
        }
      },
      positionx: {
        type: GraphQLInt,
        resolve (post) {
          return post.positionx;
        }
      },
      positiony: {
        type: GraphQLInt,
        resolve (post) {
          return post.positiony;
        }
      },
      height: {
        type: GraphQLInt,
        resolve (post) {
          return post.height;
        }
      },
      width: {
        type: GraphQLInt,
        resolve (post) {
          return post.width;
        }
      },
      status: {
        type: GraphQLInt,
        resolve (post) {
          return post.status;
        }
      },
      color: {
        type: GraphQLString,
        resolve (post) {
          return post.color;
        }
      },
      updatetime: {
        type: GraphQLString,
        resolve (post) {
          return moment(post.updatetime).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      createtime: {
        type: GraphQLString,
        resolve (post) {
          return moment(post.createtime).format("YYYY-MM-DD HH:mm:ss");
        }
      },
    }
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      user: {
        type: User,
        args: {
          id: {
            type: GraphQLInt
          },
          username: {
            type: GraphQLString
          },
          password: {
            type: GraphQLString
          },
          role: {
            type: GraphQLInt
          }
        },
        resolve (root, args) {
          if(args.password){
            args.password = crypto.createHash('md5').update(args.password).digest('hex') || '';
          }
          return UserModel.findOne({ where: args });
        }
      },
      team: {
        type: Team,
        args: {
          id: {
            type: GraphQLInt
          },
          name: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          return TeamModel.findOne({ where: args });
        }
      },
      userTeam: {
        type: UserTeam,
        args: {
          user_id: {
            type: GraphQLInt
          },
          team_id: {
            type: GraphQLInt
          }
        },
        resolve (root, args) {
          console.log(UserTeamModel)
          return UserTeamModel.findOne({ 
            where: args
          });
        }
      },
      post: {
        type: Post,
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve (root, args) {
          return PostModel.findOne({ where: args });
        }
      },
      posts: {
        type: new GraphQLList(Post),
        args: {
          team_id: {
            type: GraphQLInt
          }
        },
        resolve (root, args) {
          return PostModel.findAll({ where: args });
        }
      },
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to set stuff',
  fields () {
    return {
      createUser: {
        type: User,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          },
          role: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return UserModel.create({
            username: args.username,
            password: crypto.createHash('md5').update(args.password).digest('hex'),
            role: args.role
          });
        }
      },
      updateUser: {
        type: User,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          username: {
            type: GraphQLString
          },
          password: {
            type: GraphQLString
          },
          role: {
            type: GraphQLInt
          }
        },
        resolve (source, args) {
          return UserModel.findById(args.id).then( user => {
            return user.update({
              username: args.username,
              password: crypto.createHash('md5').update(args.password).digest('hex'),
              role: args.role
            });
          });
        }
      },
      deleteUser: {
        type: User,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return UserModel.findById(args.id).then( user => {
            return user.update({
              role: args.role
            });
          });
        }
      },
      createTeam: {
        type: Team,
        args: {
          name: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (source, args) {
          return TeamModel.create({
            name: args.name
          });
        }
      },
      updateTeam: {
        type: Team,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          name: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (source, args) {
          return TeamModel.findById(args.id).then( team => {
            return team.update({
              name: args.name
            });
          });
        }
      },
      userJoinTeam: {
        type: UserTeam,
        args: {
          user_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          team_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return UserTeamModel.findOrCreate({
            where: args 
          }).spread((userTeam, created) => {
            return userTeam;
          });
        }
      },
      createPost: {
        type: Post,
        args: {
          team_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          author: {
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          desc: {
            type: new GraphQLNonNull(GraphQLString)
          },
          zindex: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          positionx: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          positiony: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          height: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          width: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          status: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          color: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (source, args) {
          const createPostPromise = PostModel.create({
            team_id: args.team_id,
            author: args.author,
            title: args.title,
            desc: args.desc,
            zindex: args.zindex,
            positionx: args.positionx,
            positiony: args.positiony,
            height: args.height,
            width: args.width,
            status: args.status,
            color: args.color,
          });
          createPostPromise.then(post => {
            pubsub.publish('updatedPost', post.dataValues);
          })
          return createPostPromise;
        }
      },
      updatePost: {
        type: Post,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          author: {
            type: GraphQLString
          },
          title: {
            type: GraphQLString
          },
          desc: {
            type: GraphQLString
          },
          zindex: {
            type: GraphQLInt
          },
          positionx: {
            type: GraphQLInt
          },
          positiony: {
            type: GraphQLInt
          },
          height: {
            type: GraphQLInt
          },
          width: {
            type: GraphQLInt
          },
          status: {
            type: GraphQLInt
          },
          color: {
            type: GraphQLString
          }
        },
        resolve (source, args) {
          console.log('================');
          console.log(source)
          return PostModel.findById(args.id).then( post => {
            let updatedPostPromise = post.update({
              ...args
            });
            updatedPostPromise.then(post => {
              console.log(post.dataValues)
              pubsub.publish('updatedPost', post.dataValues);
            })
            return updatedPostPromise;
          });
        }
      },
      deletePost: {
        type: Post,
        args:{
          id: {
            type: GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return PostModel.findById(args.id).then( post => {
            return post.update({
              status: args.status
            });
          });
        }
      }
    };
  }
});

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  description: 'Subscription',
  fields: () => {
    return {
      updatedPost: {
        type: Post,
        args:{
          team_id: {
            type: GraphQLInt
          }
        },
        resolve (payload, args, context, info) {
          return payload;
        },
        subscribe: withFilter(() => pubsub.asyncIterator('updatedPost'), (payload, variables) => {
          return payload.team_id === variables.team_id;
        }),
      }
    }
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription
});

export default Schema;