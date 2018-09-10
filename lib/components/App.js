import Bootstrap from "./Bootstrap";
import ErrorPage from "./ErrorPage";
import FrozenHead from "react-frozenhead";
import React from "react";
import SupportStore from "../stores/SupportStore";
import { RouteHandler } from "react-router";
import ga from "react-google-analytics";

ga("create", "UA-62785624-1", "auto");
ga("send", "pageview");

export default class App extends React.Component {
  constructor() {
    super();
    this.state = SupportStore.getState();

    this._onChange = () => {
      this.setState(SupportStore.getState());
    };
  }

  componentDidMount() {
    SupportStore.listen(this._onChange);
  }

  componentWillUnmount() {
    SupportStore.unlisten(this._onChange);
  }

  render() {
    return (
      <html lang="en">
        <FrozenHead>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:url" content="https://torrentet.com" />
          <meta
            property="og:title"
            content="Torrentet - Your files, ready to flow."
          />
          <meta
            property="og:description"
            content="Peer-to-peer file transfers in your web browser."
          />
          <meta
            property="og:image"
            content="https://file.pizza/images/fb.png"
          />
          <title>Torrentet - Your files, ready to flow.</title>
          <link rel="stylesheet" href="/fonts/fonts.css" />
          <Bootstrap data={this.props.data} />
          <script src="https://cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js" />
          <script src="/app.js" />
        </FrozenHead>

        <body>
          <div className="container">
            {this.state.isSupported ? <RouteHandler /> : <ErrorPage />}
          </div>
          <footer className="footer">
            <p>
              Powered by: <strong>WebTorrent</strong> & <strong>WebRTC</strong> Protocol
            </p>

            <p className="byline">
              Cooked up by: Torrentet 2018
            </p>
          </footer>
          <script>Torrentet()</script>
          <ga.Initializer />
        </body>
      </html>
    );
  }
}
