import React, {useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {MonthYear, getNewMonthYear, isSameAsCurrentDate} from '@/utils';
import {colors} from '@/constants';
import DayOfWeeks from './DayOfWeeks';
import DateBox from './DateBox';
import {ResponseCalendarPost} from '@/api';
import YearSelector from './YearSelector';
import useModal from '@/hooks/useModal';

interface CalenderProps<T> {
  monthYear: MonthYear;
  selectedDate: number;
  schedules: Record<number, T[]>;
  onChangeMonth: (increment: number) => void;
  onPressDate: (date: number) => void;
}

function Calender<T>({
  monthYear,
  onChangeMonth,
  onPressDate,
  selectedDate,
  schedules,
}: CalenderProps<T>) {
  const {month, year, lastDate, firstDOW} = monthYear;
  const yearSelector = useModal();
  const handleChangeYear = (selectYear: number) => {
    onChangeMonth((selectYear - year) * 12);
    yearSelector.hide();
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Pressable
          style={styles.monthYearContainer}
          onPress={() => onChangeMonth(-1)}>
          <Ionicons name="arrow-back" size={25} color={colors.BLACK} />
        </Pressable>
        <Pressable
          style={styles.monthYearContainer}
          onPress={yearSelector.show}>
          <Text>
            {year}년 {month}월
          </Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={20}
            color={colors.GRAY_500}
          />
        </Pressable>
        <Pressable
          style={styles.monthYearContainer}
          onPress={() => onChangeMonth(1)}>
          <Ionicons name="arrow-forward" size={25} color={colors.BLACK} />
        </Pressable>
      </View>
      <DayOfWeeks />
      <View style={styles.bodyContainer}>
        <FlatList
          data={Array.from({length: lastDate + firstDOW}, (_, i) => ({
            id: i,
            date: i - firstDOW + 1,
          }))}
          renderItem={({item}) => (
            <DateBox
              date={item.date}
              isToday={isSameAsCurrentDate(year, month, item.date)}
              hasSchedule={Boolean(schedules[item.date])}
              selectedDate={selectedDate}
              onPressDate={onPressDate}
            />
          )}
          keyExtractor={item => String(item.id)}
          numColumns={7}
        />
      </View>
      <YearSelector
        isVisible={yearSelector.isVisible}
        currentYear={year}
        onChangeYear={handleChangeYear}
        hide={yearSelector.hide}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 25,
    marginVertical: 16,
  },
  monthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  bodyContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.GRAY_300,
    backgroundColor: colors.GRAY_100,
  },
});

export default Calender;
