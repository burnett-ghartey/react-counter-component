import React, { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    this.state = {
      curValue: 1,
    };
  }

  changeValue = ({ curValue, newValue }) => {
    this.setState({ curValue: newValue !== 100 ? newValue : 99 });
  };

  handleValueChange = (newValue, isField) => {
    const {
      props: { id, onChange },
      state: { curValue },
    } = this;

    newValue = parseInt(newValue, 10);

    if (!newValue) {
      if (isField) {
        newValue = "";
      } else {
        newValue = 1;
      }
    }
    if (newValue < 0) {
      newValue = 1;
    }
    if (!isField) {
      this.inputRef.current.style.transform =
        newValue > curValue ? "translateY(-100%)" : "translateY(100%)";
      this.inputRef.current.style.opacity = 0;

      setTimeout(() => {
        this.inputRef.current.style.transitionDuration = "0s";
        this.inputRef.current.style.transform =
          newValue > curValue ? "translateY(100%)" : "translateY(-100%)";
        this.inputRef.current.style.opacity = 0;
        this.changeValue({ curValue, newValue });

        setTimeout(() => {
          this.inputRef.current.style.transitionDuration = "0.3s";
          this.inputRef.current.style.transform = "translateY(0)";
          this.inputRef.current.style.opacity = 1;
        }, 20);
      }, 250);
    } else {
      this.changeValue({ curValue, newValue });
    }
  };

  render() {
    const { curValue } = this.state;

    return (
      <>
        <div className="counter">
          <h2 className="title">Inc-Decr App</h2>
          <div className="counter_wrap">
            <button
              onClick={() => this.handleValueChange(curValue - 1)}
              title="-1"
            >
              -
            </button>
            <div className="input_wrapper">
              <input
                maxLength={2}
                onChange={(e) => {
                  e.preventDefault();
                  this.handleValueChange(e.target.value, true);
                }}
                ref={this.inputRef}
                type="text"
                value={curValue}
              />
            </div>

            <button
              onClick={() => {
                this.handleValueChange(curValue + 1);
              }}
              title="+1"
            >
              +
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default Counter;
