


export const setRouteIdentifier = (paramValue, controller) => {
  return async (req, res) => {
    try {
      // Invoke the controller function with paramValue
      await controller(req, res, paramValue);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};
