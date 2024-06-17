import {useCallback, useEffect, useMemo, useState} from 'react';

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

// value가 변경되지 않는 한 updateDebouncedValue 함수는 동일한 참조를 유지.
// 리렌더링이 발생하더라도 value가 변경되지 않으면 updateDebouncedValue 함수가 재생성되지 않음.
  const updateDebouncedValue = useCallback(() => {
    setDebouncedValue(value);
  }, [value]);


  useEffect(() => {
  // updateDebouncedValue 함수를 delay 시간이 지난 후에 실행하도록 설정.

    const timer = setTimeout(updateDebouncedValue, delay);

// 클린업 함수, 컴포넌트가 언마운트되거나 의존성 배열 내의 값이 변경될 때 호출
// clearTimeout을 사용하여 이전에 설정된 타이머를 정리
    return () => {
      clearTimeout(timer);
    };
  }, [delay, updateDebouncedValue]);

// useMemo를 사용하면, debouncedValue가 변경되지 않는 한 동일한 참조를 유지.
// 값이 불필요하게 재생성되는 것을 방지한다.
  return useMemo(() => debouncedValue, [debouncedValue]);
}

export default useDebounce;
