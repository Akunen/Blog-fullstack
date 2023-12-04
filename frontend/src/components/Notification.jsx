const Notification = ({ notification }) => {
  if (!notification || !notification.message) {
    return null;
  }

  const { message, isError } = notification;
  console.log('message', message);

  if (isError) {
    return <div className='errorMessage'>{message}</div>;
  }

  return <div className='successMessage'>{message}</div>;
};

export default Notification;
