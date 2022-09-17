import { LogCardProps } from '../Types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogCard = (props: LogCardProps): JSX.Element => {
  const navigate = useNavigate();
  const { analyzedPod, setAnalyzedPod }: any = props;

  const handleAnalyze = () => {
    setAnalyzedPod({ ...props.oomObj });
    navigate('/analysis');
  };

  // create the header elements
  let headerObj: { [key: string]: string } = {};
  let bodyObj: { [key: string]: string } = {};
  if (props.logType === 'events' && props.eventObj) {
    // part 1: anonymous function with input and output (take in args, returns and object)
    // (({namespace, severity}) => ({namespace, severity}))
    // part 2: invoke the function on props.eventObj
    headerObj = (({ namespace, severity }) => ({ namespace, severity }))(
      props.eventObj
    );
    bodyObj = (({ reason, message, object, lastSeen }) => ({
      reason,
      message,
      object,
      lastSeen,
    }))(props.eventObj);
  } else if (props.logType === 'alerts' && props.alertObj) {
    headerObj = (({ group, severity }) => ({ group, severity }))(
      props.alertObj
    );
    bodyObj = (({ name, state, description, summary }) => ({
      name,
      state,
      description,
      summary,
    }))(props.alertObj);
  } else if (props.logType === 'oomkills' && props.oomObj) {
    headerObj = (({ namespace }) => ({ namespace }))(props.oomObj);
    bodyObj = (({
      podName,
      restartcount,
      laststate,
      reason,
      exitcode,
      started,
      finished,
    }) => ({
      podName,
      restartcount,
      laststate,
      reason,
      exitcode,
      started,
      finished,
    }))(props.oomObj);
  }

  const header: JSX.Element[] = [];
  const body: JSX.Element[] = [];
  // need to make sure order is perserved in objects!!!
  let k = 500;
  for (const x in headerObj) {
    const label: string = x[0].toUpperCase() + x.slice(1) + ':';

    header.push(
      <div key={k++}>
        <p>
          <strong>{label}</strong> {headerObj[x]}
        </p>
      </div>
    );
  }
  for (const x in bodyObj) {
    let label: string = x[0].toUpperCase() + x.slice(1) + ':';

    // Fixes the capitalization of body labels
    switch (label) {
      case 'PodName:':
        label = 'Pod Name:';
        break;
      case 'Restartcount:':
        label = 'Restart Count:';
        break;
      case 'Laststate:':
        label = 'Last State:';
        break;
      case 'Exitcode:':
        label = 'Exit Code:';
        break;
      case 'LastSeen:':
        label = 'Last Seen:';
        break;
      default:
        break;
    }

    body.push(
      <div key={k++}>
        <p>
          <strong>{label}</strong> {bodyObj[x]}
        </p>
      </div>
    );
  }

  return (
    <div className="event-card">
      {props.logType === 'oomkills' && (
        <div>
          <button onClick={handleAnalyze} className="analyze">
            Analyze
          </button>
        </div>
      )}
      <header className="event-card-header">{header}</header>
      {body}
    </div>
  );
};

export default LogCard;
