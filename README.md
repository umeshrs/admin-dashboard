# Admin Dashboard

## Dependencies

### Technology

* [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Meteor.js](https://www.meteor.com/install)

### 3rd party apps

* [Rocket chat](https://github.com/RocketChat/Rocket.Chat/)
* [Wekan](https://github.com/wekan/wekan)
* [Reaction Commerce](https://github.com/reactioncommerce/reaction)

## Installation

1. Install meteor
   For OS X or Linux

   ```
   curl https://install.meteor.com/ | sh
   ```

   For Windows, download the installer [here](https://install.meteor.com/windows).

   Please see the official installation [instructions](https://www.meteor.com/install) for more information.
2. Clone [rocket-chat](https://github.com/umeshrs/rocket-chat)

  ```
  git clone https://github.com/umeshrs/rocket-chat.git
  cd rocket-chat
  meteor run --port 4000
  ```

3. Clone [wekan](https://github.com/umeshrs/wekan)

  ```
  git clone https://github.com/umeshrs/wekan.git
  cd wekan
  meteor run --port 5000
  ```

4. Clone [reaction](https://github.com/umeshrs/reaction)

  ```
  git clone https://github.com/umeshrs/reaction.git
  cd rocket-chat
  meteor run --port 7000 --settings settings/settings.json
  ```
  *Note:* Don't forget to pass the settings file as an option to the `meteor run` command.

5. Clone [admin-dashboard](https://github.com/umeshrs/admin-dashboard)

  ```
  git clone https://github.com/umeshrs/admin-dashboard.git
  cd admin-dashboard
  ```
  1. Open the file `lib/constants.js` in a text editor

      ```
      vim lib/constants.js
      ```
  2. **Important!** Replace `192.168.1.122` with ***your*** IP address. *Optionally*, you may edit the port numbers if you have chosen to run the above apps on different ports than what was shown in the example. 

      ```
      ROCKET_CHAT_DOMAIN = "192.168.1.122"; // Replace this with your IP address
      ROCKET_CHAT_PORT = "4000";
      WEKAN_DOMAIN = "192.168.1.122"; // Replace this with your IP address
      WEKAN_PORT = "5000";
      REACTION_DOMAIN = "192.168.1.122";  // Replace this with your IP address
      REACTION_PORT = "7000";
      ```
  3. Save the changes that you made in the previous step and start meteor

      ```
      meteor
      ```

If you followed the above instructions correctly, you will be able to access the admin app at `http://localhost:3000`
