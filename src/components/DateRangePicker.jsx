// Libs
import React from "react";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit(e, data) {
    this.props.fetchDateRange(data.startDate, data.endDate);
  }

  handleReset(e, data) {
    this.props.resetCallback();
  }
  render() {
    const { from, to, userSelectedDate } = this.props;
    return (
      <div className="date-container">
        <DateRangePicker
          startDate={moment(from)}
          endDate={moment(to)}
          onApply={this.handleSubmit}
          onEvent={this.props.onEvent}
        >
          <div className="inner-container">
            <input
              type="text"
              placeholder="Choose a Date Range"
              value={`${moment(from).format("MM/DD/YY")} - ${moment(to).format(
                "MM/DD/YY"
              )}`}
            />
          </div>
        </DateRangePicker>
      </div>
    );
  }
}

export const DatePickerBasic = props => {
  return (
    <div className="date-container">
      <DateRangePicker
        startDate={
          props.startDate
            ? moment(props.startDate)
            : moment()
                .subtract("6", "month")
                .format("MM/DD/YY")
        }
        endDate={
          props.endDate ? moment(props.endDate) : moment().format("MM/DD/YY")
        }
        onApply={(e, t) => props.handleApply(e, t)}
      >
        <input
          className="Select-input"
          type="text"
          placeholder="Choose a Date Range"
          style={{ width: "160px", height: "35px" }}
          value={
            props.startDate && props.endDate
              ? `${moment(props.startDate).format("MM/DD/YY")} - ${moment(
                  props.endDate
                ).format("MM/DD/YY")}`
              : `${moment()
                  .subtract("6", "month")
                  .format("MM/DD/YY")} - ${moment().format("MM/DD/YY")}`
          }
        />
      </DateRangePicker>
    </div>
  );
};
