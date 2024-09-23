const router = require('express').Router();
const users = require('../data');

router.post('/api/1.0/auth/signup', (req, res) => {
  const user = req.body;

  const email = user.email;
  const foundUser = users.find((user) => user.email === email);

  if (foundUser) {
    return res.status(500).send({
      feedBackMessage: 'This e-mail has been already taken'
    });
  }

  return res.send({ ...user, feedBackMessage: 'Success! Please check your e-mail to activate your account' });
});

router.post('/api/1.0/auth/ckeckEmailInUse', (req, res) => {
  const email = req.body.email;

  const foundUser = users.find((user) => user.email === email);

  if (foundUser) {
    return res.status(200).send({
      emailInUse: true
    });
  }

  return res.send({});
});

module.exports = router;
