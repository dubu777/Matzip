import Calender from '@/components/calendar/Calendar';
import EventList from '@/components/calendar/EventList';
import {colors} from '@/constants';
import useGetCalendarPosts from '@/hooks/queries/useGetCalendarPosts';
import {getMonthYearDetails, getNewMonthYear} from '@/utils';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

function CalendarHomeScreen() {
  const currentMonthYear = getMonthYearDetails(new Date());
  const [monthYear, setMonthYear] = useState(currentMonthYear);
  const [selectedDate, setSelectedDate] = useState(0);
  const {
    data: posts,
    isPending,
    isError,
  } = useGetCalendarPosts(monthYear.year, monthYear.month);

  if (isPending || isError) {
    return <></>;
  }


  const handlePressDate = (date: number) => {
    setSelectedDate(date);
  };
  const handleUpdateMonth = (increment: number) => {
    setSelectedDate(0);
    setMonthYear(prev => getNewMonthYear(prev, increment));
  };
  return (
    <SafeAreaView style={styles.container}>
      <Calender
        schedules={posts}
        monthYear={monthYear}
        onChangeMonth={handleUpdateMonth}
        onPressDate={handlePressDate}
        selectedDate={selectedDate}
      />
      <EventList posts={posts[selectedDate]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
  },
});

export default CalendarHomeScreen;
