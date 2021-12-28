const ChatBot = class {
  constructor(bots) {
    this.bots = bots;
  }

  renderBotNavbar() {
    const chatList = document.getElementsByClassName('bot-list')[0];
    chatList.innerHTML = null;
    this.bots.forEach((bot) => {
      const botCard = `
        <li class='clearfix'>
          <img src='${bot.image}' alt='avatar'>
          <div class='about w-75'>
            <div class='name w-100 d-flex justify-content-between'>${bot.name}<span class="badge badge-info align-self-center">${bot.numberOfMessage}</span></div>
            <div class='status'> <i class='fa fa-circle ${bot.status === 'online' ? 'online' : 'offline'}'></i> ${bot.status} </div>
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
      <div class='clearfix'>
        <div class='message-data ${user.name === 'You' ? 'text-right' : ''}'>
          <span class='message-data-time'>${user.name} (${hours}:${minutes})</span>
          <img src='${user.image}' alt='avatar'>
        </div>
        <div class='message other-message ${user.name === 'You' ? 'float-right' : ''}'> ${message} </div>
      </div>
    `;

    const chatList = document.getElementById('chat-list');
    chatList.innerHTML += messageCard;
    chatList.scrollTop = chatList.scrollHeight;

    user.numberOfMessage += 1;
    this.renderBotNavbar();
  };

  useHelp = (bot) => {
    const message = `
      <p class='text-left'>/help</p>
      <p class='text-left'>/hello</p>
      <p class='text-left'>/nba (First name) (Last name)</p>
      <p class='text-left'>/weather</p>
      <p class='text-left'>/hour</p>
      <p class='text-left'>/song (Artist name)</p>
      <p class='text-left'>/chucknorris</p>
    `;
    this.sendMessage(message, bot);
  };

  useHour = (bot) => {
    const today = new Date();
    const date = `${bot.country}: ${today.toLocaleString(bot.timezone[0], { timeZone: bot.timezone[1] })}`;
    this.sendMessage(date, bot);
  };

  drawWeather = (d, bot) => {
    const celcius = Math.round(parseFloat(d.main.temp) - 273.15);
    const { description } = d.weather[0];
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

  useNBA = (message, bot) => {
    message.shift();
    fetch(`https://free-nba.p.rapidapi.com/players?search=${message.join('%20')}`, {
      headers: {
        'x-rapidapi-host': 'free-nba.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPID_API_KEY
      }
    })
      .then((response) => response.json())
      .then((res) => {
        const messageData = `${res.data[0].first_name} ${res.data[0].last_name}: ${res.data[0].team.full_name} (${res.data[0].team.abbreviation})`;
        this.sendMessage(messageData, bot);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  useSearchSongs = (message, bot) => {
    message.shift();
    fetch(`https://genius.p.rapidapi.com/search?q=${message.join('%20')}`, {
      headers: {
        'x-rapidapi-host': 'genius.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPID_API_KEY
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const div = document.createElement('div');
        data.response.hits.forEach((song) => {
          div.innerHTML += `<p class='text-left'><img src='${song.result.song_art_image_thumbnail_url}' alt='avatar' width='60' height='60'> - ${song.result.title} - ${song.result.artist_names}</p>`;
        });
        this.sendMessage(div.innerHTML, bot);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  useChuckNorrisJoke = (bot) => {
    fetch('https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random', {
      headers: {
        'x-rapidapi-host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPID_API_KEY
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const message = `<p class='text-left'><img src='${data.icon_url}' alt='avatar'> - ${data.value}</p>`;
        this.sendMessage(message, bot);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  useCommand = (message, bot) => {
    switch (message[0]) {
      case '/help':
        this.useHelp(bot);
        break;
      case '/hello':
        this.sendMessage('this servant greets you, my Lord!', bot);
        break;
      case '/hour':
        this.useHour(bot);
        break;
      case '/nba':
        this.useNBA(message, bot);
        break;
      case '/weather':
        this.useWeather(bot);
        break;
      case '/song':
        this.useSearchSongs(message, bot);
        break;
      case '/chucknorris':
        this.useChuckNorrisJoke(bot);
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
