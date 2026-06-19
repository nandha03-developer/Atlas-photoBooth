import React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

function generateAvatarName(name) {
  // Generate initials from the name
  const initials = name.split(' ').map((part) => part[0]).join('').toUpperCase();
  return initials;
}

function UserAvatar({ name, email }) {
  const avatarName = generateAvatarName(name || email);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar>{avatarName}</Avatar>
      {/* Display additional user information */}
      <div>
        <div>{name}</div>
        <div>{email}</div>
      </div>
    </Stack>
  );
}

export default UserAvatar;
