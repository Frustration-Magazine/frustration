const useEvent = () => {
  const events = [];

  const updateEvent = () => {
    console.log("update event!");
  };
  const addEvent = () => {
    console.log("add event!");
  };

  return {
    addEvent,
    updateEvent,
  };
};

export default useEvent;
