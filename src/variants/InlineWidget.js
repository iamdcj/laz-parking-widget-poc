const InlineWidget = ({ results }) => {
  return (
    <div>
      <p>This is the Inline Widget</p>
      {results.map(({ EventName }) => (
        <>{EventName}</>
      ))}
    </div>
  );
};

export default InlineWidget;
