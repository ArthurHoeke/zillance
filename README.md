<p align="center">
  <h3 align="center">zillance</h3>

  <p align="center">
    Zillance is an open-source freelance platform aimed at the Zilliqa blockchain.
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

Zillance is a free, open-source platform where businesses can easily get in contact with freelancers and freelancers can find companions for projects. Zillance was build with the intention to encourage new developers on the Zilliqa blockchain to work together and build new awesome projects.

Currently Zillance provides;
* User-friendly minimalist front-end
* Express JS back-end server
* Private key system for post deletion
* Category system

### Built With
* [NodeJS](https://nodejs.org/en/)
* [ExpressJS](https://expressjs.com/)
* [jQuery](https://jquery.com/)

## Getting Started

### Prerequisites

Before setup make sure you have [Node JS](https://nodejs.org/en/download/) installed.<br />
Follow the instructions on how to install these via the provided links.

### Installation

1. Clone the repo
```sh
git clone https://github.com/ArthurHoeke/zillance.git
```
2. Install NPM packages for server
```sh
npm install
```
3. Enter your server address in client Javascript variable `client/js/main.js`
```JS
const apiAddress = "http://localhost:80";
```



<!-- USAGE EXAMPLES -->
## Usage

Start server before using client
```sh
npm start
```

<!-- CONTRIBUTING -->
## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.
