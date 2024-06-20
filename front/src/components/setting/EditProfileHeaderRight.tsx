import React from 'react';
import HeaderButton from '../common/HeaderButton';

interface EditProfileHeaderRightProps {
  onSubmit: () => void;
}

function EditProfileHeaderRight({onSubmit}: EditProfileHeaderRightProps) {
  return (
    <HeaderButton labelText='완료' onPress={onSubmit}/>
  )
}

export default EditProfileHeaderRight;
