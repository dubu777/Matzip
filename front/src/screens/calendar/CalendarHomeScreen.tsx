import Calender from '@/components/calendar/Calendar';
import { getMonthYearDetails, getNewMonthYear } from '@/utils';
import React, { useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';


function CalendarHomeScreen() {
  const currentMonthYear = getMonthYearDetails(new Date());
  const [monthYear, setMonthYear] = useState(currentMonthYear)
  const [selectedDate, setSelectedDate] = useState(0);

  const handlePressDate = (date: number) => {
    setSelectedDate(date)
  }
  const handleUpdateMonth = (increment: number) => {
    setSelectedDate(0)
    setMonthYear(prev => getNewMonthYear(prev, increment))
  }
  return (
    <Calender monthYear={monthYear} onChangeMonth={handleUpdateMonth} onPressDate={handlePressDate} selectedDate={selectedDate}/>
  )
}

const styles = StyleSheet.create({});

export default CalendarHomeScreen;
