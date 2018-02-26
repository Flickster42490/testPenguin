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
            Filter by Date:&nbsp;&nbsp;
            <input
              type="text"
              placeholder="Choose a Date Range"
              style={{ width: "13em" }}
              value={`${moment(from).format("MMM DD, YYYY")} - ${moment(
                to
              ).format("MMM DD, YYYY")}`}
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
          props.filters
            ? moment(props.filters.startDate)
            : moment()
                .subtract("6", "month")
                .format("MM/DD/YYYY")
        }
        endDate={
          props.filters
            ? moment(props.filters.endDate)
            : moment().format("MM/DD/YYYY")
        }
        // onApply={(e, d) =>
        //   props.onAddFilter("date", {
        //     startDate: d.startDate,
        //     endDate: d.endDate
        //   })
        // }
      >
        <input
          className="Select-input"
          type="text"
          placeholder="Choose a Date Range"
          style={{ width: "100%", fontSize: ".8rem" }}
          value={
            props.filters
              ? `${moment(props.filters.startDate).format(
                  "MM/DD/YYYY"
                )} - ${moment(props.filters.endDate).format("MM/DD/YYYY")}`
              : `${moment()
                  .subtract("6", "month")
                  .format("MM/DD/YY")} - ${moment().format("MM/DD/YY")}`
          }
        />
      </DateRangePicker>
    </div>
  );
};
