import React from "react";

const Conversation = () => {
  return (
    <div className="conversation-area">
      <div className="msg online">
        <img
          className="msg-profile"
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png"
          alt=""
        />
        <div className="msg-detail">
          <div className="msg-username">Madison Jones</div>
          <div className="msg-content">
            <span className="msg-message">What time was our meet</span>
            <span className="msg-date">20m</span>
          </div>
        </div>
      </div>
     
      <div className="msg online">
        <img
          className="msg-profile"
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png"
          alt=""
        />
        <div className="msg-detail">
          <div className="msg-username">Lea Debere</div>
          <div className="msg-content">
            <span className="msg-message">Shoreditch iPhone jianbing</span>
            <span className="msg-date">45m</span>
          </div>
        </div>
      </div>
      <div className="msg online">
        <img
          className="msg-profile"
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29+%281%29.png"
          alt=""
        />
        <div className="msg-detail">
          <div className="msg-username">Jordan Smith</div>
          <div className="msg-content">
            <span className="msg-message">
              Snackwave craft beer raclette, beard kombucha{" "}
            </span>
            <span className="msg-date">2h</span>
          </div>
        </div>
      </div>
      <div className="msg">
        <img
          className="msg-profile"
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%284%29+%281%29.png"
          alt=""
        />
        <div className="msg-detail">
          <div className="msg-username">Jared Jackson</div>
          <div className="msg-content">
            <span className="msg-message">
              Tattooed brooklyn typewriter gastropub
            </span>
            <span className="msg-date">18m</span>
          </div>
        </div>
      </div>
      <div className="msg online">
        <img
          className="msg-profile"
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png"
          alt=""
        />
        <div className="msg-detail">
          <div className="msg-username">Henry Clark</div>
          <div className="msg-content">
            <span className="msg-message">
              Ethical typewriter williamsburg lo-fi street art
            </span>
            <span className="msg-date">2h</span>
          </div>
        </div>
      </div>
      <div className="msg">
        <img
          className="msg-profile"
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/qs6F3dgm.png"
          alt=""
        />
        <div className="msg-detail">
          <div className="msg-username">Jason Mraz</div>
          <div className="msg-content">
            <span className="msg-message">
              I'm lucky I'm in love with my best friend
            </span>
            <span className="msg-date">4h</span>
          </div>
        </div>
      </div>
      <div className="msg">
        <img
          className="msg-profile"
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%288%29.png"
          alt=""
        />
        <div className="msg-detail">
          <div className="msg-username">Chiwa Lauren</div>
          <div className="msg-content">
            <span className="msg-message">Pabst af 3 wolf moon</span>
            <span className="msg-date">28m</span>
          </div>
        </div>
      </div>
      <div className="msg">
        <img
          className="msg-profile"
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%289%29.png"
          alt=""
        />
        <div className="msg-detail">
          <div className="msg-username">Caroline Orange</div>
          <div className="msg-content">
            <span className="msg-message">
              Bespoke aesthetic lyft woke cornhole
            </span>
            <span className="msg-date">35m</span>
          </div>
        </div>
      </div>
      <div className="msg">
        <img
          className="msg-profile"
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%286%29.png"
          alt=""
        />
        <div className="msg-detail">
          <div className="msg-username">Lina Ashma</div>
          <div className="msg-content">
            <span className="msg-message">Migas food truck crucifix vexi</span>
            <span className="msg-date">42m</span>
          </div>
        </div>
      </div>
      <button className="add"></button>
      <div className="overlay"></div>
    </div>
  );
};

export default Conversation;
