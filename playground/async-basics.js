console.log('1. Starting app');

setTimeout(() => {
  console.log('2. Inside of callback');
}, 2000);

setTimeout(() => {
  console.log('3. Second setTimeout');
}, 0);

console.log('4. Finishing up');

console.log('5. Next Try');

setTimeout(() => {
    console.log('6. Inside of callback');
  }, 2000, () => {
    setTimeout(() => {
        console.log('7. Second setTimeout -- this never gets executed');
      }, 0);
  });
  
  console.log('8. Finishing up');


  var getUser = (id, callback) => {
    var user = {
      id: id,
      name: 'Vikram'
    };
  
    setTimeout(() => {
      callback(user);
    }, 3000);
  };
  
  getUser(31, (userObject) => {
    console.log('9. Next call', userObject);
  });


  