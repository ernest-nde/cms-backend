const { Sequelize, DataTypes } = require('sequelize');
const roles = require('./roles');
const roleModel = require('../models/Role');
const userModel = require('../models/User');
const postCategoryModel = require('../models/Category');
const postModel = require('../models/Post');
const commentModel = require('../models/Comment');

const sequelize = new Sequelize(
    'cms-backend',
    'root',
    '',
    {
        host: '127.0.0.1',
        dialect: 'mariadb',
        logging: false
    }
);

const Role = roleModel(sequelize, DataTypes);
const User = userModel(sequelize, DataTypes);
const Category = postCategoryModel(sequelize, DataTypes);
const Post = postModel(sequelize, DataTypes);
const Comment = commentModel(sequelize, DataTypes);

// MODELS ASSOCATIONS
// Role and User associations
Role.hasMany(User, {
    foreignKey: {
        name: 'roleId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'

});
User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role'
});

// Category and User associations
User.hasMany(Category, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'

});
Category.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// User and Post associations
User.hasMany(Post, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'

});
Post.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Category and Post associations
Category.hasMany(Post, {
    foreignKey: {
        name: 'categoryId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'

});
Post.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
});

// User and Comment associations
User.hasMany(Comment, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'

});
Comment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Comment and Post associations
Post.hasMany(Comment, {
    foreignKey: {
        name: 'postId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'

});
Comment.belongsTo(Post, {
    foreignKey: 'postId',
    as: 'post'
});

// Comment to Comment associations
Comment.hasMany(Comment, {
    foreignKey: {
        name: 'commentId',
        allowNull: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Comment.belongsTo(Comment, {
    foreignKey: 'commentId',
    as: 'first_comment'
});


const  database_sync = async () => {
   await sequelize.sync()
   .then( () => {
        console.log(`Database synchronised successfully!`);
        roles.forEach( role => {
            Role.findOrCreate({
                where: { 
                    title: role.title,
                    description: role.description
                 }
            })
            .then(() => {
                console.log(`Role ${role.title} created !`);
            })
            .catch(error => {
                console.error(`Error occured while creating role ${role.title}`, error);
            })
        })       
   })
   .catch( (error) => {
        console.error(`Error occured while syncing data to database`, error);
   });
};

module.exports = {
    database_sync,
    Role,
    User,
    Category,
    Post,
    Comment
}
