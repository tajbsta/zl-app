import { useEffect, useState, useCallback } from 'preact/hooks';
import {
  endOfDay,
  isSameDay,
  startOfDay,
} from 'date-fns';
import { connect } from 'react-redux';
import useFetch from 'use-http'

import { API_BASE_URL } from 'Shared/fetch';
import ScheduleItem from './ScheduleItem';
import NoScheduleFallback from './NoScheduleFallback';

const ScheduleList = ({ animals, zoos, date }) => {
  const {
    get,
    response,
    loading,
  } = useFetch(API_BASE_URL);

  const [schedules, setSchedules] = useState([]);

  const getSchedule = useCallback(async (date, animals, zoos) => {
    const params = new URLSearchParams();

    if (animals.length) {
      animals.forEach((animal) => params.append('animals[]', animal));
    }

    if (zoos.length) {
      zoos.forEach((zoo) => params.append('zoos[]', zoo));
    }

    const now = new Date();
    if (isSameDay(now, date)) {
      params.append('startTime', now.getTime());
    } else {
      params.append('startTime', startOfDay(date).getTime());
    }

    params.append('endTime', endOfDay(date).getTime());

    const schedulesData = await get(`/livetalks/schedule?${params}`);
    setSchedules(schedulesData);
  }, [setSchedules, get]);

  useEffect(() => {
    getSchedule(date, animals, zoos);
  }, [animals, zoos, date, getSchedule])

  if (loading) {
    // TODO: #176855073 - Custom Loader component
    return (
      <div>Loading...</div>
    )
  }

  if (response.status === 200 && !loading && !schedules.length) {
    return (<NoScheduleFallback />)
  }

  return (
    <>
      {schedules.map(({
        animal,
        liveTalks,
        zoo,
        habitatId,
      }) => (
        <ScheduleItem liveTalks={liveTalks} animal={animal} zoo={zoo} key={habitatId} />
      ))}
    </>
  )
};

export default connect((
  { schedule: { filters: { animals, zoos, date }}},
) => (
  { animals, zoos, date}
))(ScheduleList)