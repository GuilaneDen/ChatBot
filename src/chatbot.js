const ChatBot = class {
  constructor(bots) {
    this.bots = bots;
  }

  renderBotNavbar() {
    const chatList = document.getElementsByClassName('bot-list')[0];
    this.bots.forEach((bot) => {
      const botCard = `
        <li class="clearfix">
          <img src="${bot.image}" alt="avatar">
          <div class="about">
            <div class="name">${bot.name}</div>
          </div>
        </li>
      `;
      chatList.innerHTML += botCard;
    });
  }

  sendMessage = (message, user) => {
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();

    const messageCard = `
      <li class="clearfix">
        <div class="message-data ${user.name === 'You' ? 'text-right' : ''}">
          <span class="message-data-time">${user.name} (${hours}:${minutes})</span>
          <img src="${user.image}" alt="avatar">
        </div>
        <div class="message other-message ${user.name === 'You' ? 'float-right' : ''}"> ${message} </div>
      </li>
    `;

    const chatList = document.getElementById('chat-list');
    chatList.innerHTML += messageCard;
    chatList.scrollTo = chatList.scrollHeight;
  };

  useHelp = (bot) => {
    const message = `
      <p class="text-left">/help</p>
      <p class="text-left">/uber (location) (destination)</p>
      <p class="text-left">/weather</p>
      <p class="text-left">/hour</p>
      <p class="text-left">/travel (location) (destination)</p>
    `;
    this.sendMessage(message, bot);
  };

  useHour = (bot) => {
    console.log(bot);
    const today = new Date();
    const date = `${bot.country}: ${today.toLocaleString(bot.timezone[0], { timeZone: bot.timezone[1] })}`;
    this.sendMessage(date, bot);
  };

  drawWeather = (d, bot) => {
    const celcius = Math.round(parseFloat(d.main.temp) - 273.15);
    const description = d.weather[0].description;
    const weather = `${description} - ${celcius}°C - ${d.name}`;
    this.sendMessage(weather, bot);
  };

  useWeather = (bot) => {
    const key = process.env.WEATHER_API_KEY;
    fetch(`https://api.openweathermap.org/data/2.5/weather?id=2968815&appid=${key}`)
      .then((resp) => resp.json()) // Convert data to json
      .then((data) => {
        this.drawWeather(data, bot);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  useUber = () => {
    console.log('HOUR');
  };

  useGoogleTravel = (message, bot) => {
      console.log("er");
    fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${message[1]}&destinations=${message[2]}&departure_time=now&key=${process.env.GOOGLE_API_KEY}`)
      .then((response) => {
        console.log(response);
      });
  };

  useCommand = (message, bot) => {
      console.log(message);
    switch (message[0]) {
      case '/help':
        this.useHelp(bot);
        break;
      case '/hour':
        this.useHour(bot);
        break;
      case '/uber':
        this.useUber(message, bot);
        break;
      case '/weather':
        this.useWeather(bot);
        break;
      case '/travel':
        this.useGoogleTravel(message, bot);
        break;
      default:
        break;
    }
  };

  searchCommand = (message) => {
    const messageArray = message.split(' ');
    this.bots.forEach((bot) => {
      if (bot.keywords.includes(messageArray[0])) {
        this.useCommand(messageArray, bot);
      }
    });
  };
};

export default ChatBot;
