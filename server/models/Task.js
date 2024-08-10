module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    IsDeleted: {
      type: DataTypes.BOOLEAN,
    
      defaultValue: false
    }
  });

  //******************** */
  Task.associate = function (models) {
    Task.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Task;
};
