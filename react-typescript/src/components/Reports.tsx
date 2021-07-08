import * as React from 'react';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import DownloadLink from 'react-download-link';

class Reports extends React.Component<
  {},
  {
    is200: boolean | null;
    is500: boolean | null;
  }
> {
  constructor(props: {}) {
    super(props);

    this.downloadReport = this.downloadReport.bind(this);

    this.state = {
      is200: null,
      is500: null,
    };
  }

  async downloadReport(reportName: string) {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/reports/${reportName}`
      );
      const jsonData = res.data;
      console.log(jsonData);

      this.setState({
        is200: true,
      });

      return JSON.stringify(jsonData, null, 4);
    } catch (error) {
      console.log(error);
      if (error.response.status === 500) {
        this.setState({ is500: true });
      }
      return 'An error has occurred, please try again.';
    }
  }

  render() {
    return (
      <div className="my-class">
        {this.state.is200 ? (
          <Alert variant="success">
            You have successfully triggered the report download.
          </Alert>
        ) : this.state.is500 ? (
          <Alert variant="danger">
            An error has occurred, please try again.
          </Alert>
        ) : (
          ''
        )}
        <h1>Reports</h1>
        <DownloadLink
          tagName="button"
          label="Download Workload Report"
          filename="workload-report.json"
          exportFile={() => Promise.resolve(this.downloadReport('workload'))}
        />
      </div>
    );
  }
}

export default Reports;
