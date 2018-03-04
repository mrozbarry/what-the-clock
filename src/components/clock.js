import { h } from 'hyperapp';

export default ({ time }) => {
  const hour = time.hour + (time.minute / 60)
  return (
    <svg width="400" height="400">
      <circle
        cx="200"
        cy="200"
        r="195"
        style={{
          stroke: 'black',
          strokeWidth: '5px',
          fill: 'white',
        }}
      />
      {'x'.repeat(12).split('').map((_, idx) => {
        return (
          <line
            x1="200"
            y1="20"
            x2="200"
            y2="30"
            transform={`rotate(${idx * 360 / 12} 200 200)`}
            style={{
              stroke: 'black',
              strokeWidth: '1px'
            }}
          />
        );
      })}

      <line
        x1="200"
        y1="200"
        x2="200"
        y2="20"
        transform={`rotate(${time.minute * 360 / 60} 200 200)`}
        style={{
          stroke: 'black',
          strokeWidth: '10px',
          transition: 'transform .3s ease-in-out',
        }}
      />
      <line
        x1="200"
        y1="200"
        x2="200"
        y2="100"
        transform={`rotate(${hour * 360 / 12} 200 200)`}
        style={{
          stroke: 'red',
          strokeWidth: '5px',
          transition: 'transform .3s ease-in-out',
        }}
      />

      <circle
        cx="200"
        cy="200"
        r="10"
        style={{
          stroke: 'black',
          strokeWidth: '2px',
          fill: 'white',
        }}
      />

    </svg>
  );
};
