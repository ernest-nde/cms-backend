module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Email already taken!'
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthday: {
            type: DataTypes.DATEONLY(),
            allowNull: false,
            validate: {
                isDate: {
                    args: true,
                    msg: 'Birthday must be a valid date (YYYY-MM-DD)'
                },
                notEmpty: true,
            }
        }
    })
}