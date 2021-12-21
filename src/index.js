import './index.scss';

const Bot = class {
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
};

const bots = [
  {
    name: 'You',
    image: 'https://bootdey.com/img/Content/avatar/avatar1.png',
    keywords: ['/help']
  },
  {
    name: 'Aiden Chavez',
    image: 'https://bootdey.com/img/Content/avatar/avatar2.png',
    keywords: ['/hour', '/uber'],
    timezone: ['en-GB', 'Europe/London'],
    country: 'United-Kingdom'
  },
  {
    name: 'Mike Thomas',
    image: 'https://bootdey.com/img/Content/avatar/avatar3.png',
    keywords: ['/hour', '/weather'],
    timezone: ['fr-FR', 'Europe/Paris'],
    country: 'France'
  },
  {
    name: 'Christian Kelly',
    image: 'https://bootdey.com/img/Content/avatar/avatar7.png',
    keywords: ['/hour', '/country'],
    timezone: ['en-US', 'America/New_York'],
    country: 'United States of America'
  }
];

const chatbox = new Bot(bots);

chatbox.renderBotNavbar();

const sendMessage = (message, user) => {
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

  document.getElementById('chat-list').innerHTML += messageCard;
};

const useHelp = (bot) => {
  const message = `
    <p>/help</p>
    <p>/uber (location) (destination)</p>
    <p>/weather</p>
    <p>/hour</p>
  `;
  sendMessage(message, bot);
};

const useHour = (bot) => {
  console.log(bot);
  const today = new Date();
  const date = `${bot.country}: ${today.toLocaleString(bot.timezone[0], { timeZone: bot.timezone[1] })}`;
  sendMessage(date, bot);
};

const drawWeather = (d, bot) => {
  const celcius = Math.round(parseFloat(d.main.temp) - 273.15);
  const description = d.weather[0].description;
  const weather = `${description} - ${celcius}°C - ${d.name}`;
  sendMessage(weather, bot);
};

const useWeather = (bot) => {
  const key = 'f2da95395a8a5f7f507375ddb98ffa76';
  fetch(`https://api.openweathermap.org/data/2.5/weather?id=2968815&appid=${key}`)
    .then((resp) => resp.json()) // Convert data to json
    .then((data) => {
      drawWeather(data, bot);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const useUber = () => {
  console.log('HOUR');
};

const useCommand = (message, bot) => {
  switch (message[0]) {
    case '/help':
      useHelp(bot);
      break;
    case '/hour':
      useHour(bot);
      break;
    case '/uber':
      useUber(message, bot);
      break;
    case '/weather':
      useWeather(bot);
      break;
    default:
      break;
  }
};

const searchCommand = (message) => {
  const messageArray = message.split(' ');
  chatbox.bots.forEach((bot) => {
    if (bot.keywords.includes(messageArray[0])) {
      useCommand(messageArray, bot);
    }
  });
};

document.getElementById('research').onclick = function () {
  const message = document.getElementById('search').value;
  document.getElementById('search').value = '';
  sendMessage(message, chatbox.bots[0]);
  searchCommand(message);
};

document.getElementById('search').onkeyup = function (e) {
  if (e.key === 'Enter') {
    const message = document.getElementById('search').value;
    document.getElementById('search').value = '';
    sendMessage(message, chatbox.bots[0]);
    searchCommand(message);
  }
};
