import { h } from 'hyperapp';

export default ({ title }, body) => (
  <div
    style={{
      position: 'fixed',
      top: '35%',
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderTop: '1px black solid',
      borderBottom: '1px black solid',
    }}
    role="dialog"
  >
    <h1>{title}</h1>
    <section
      style={{
        maxWidth: '80%',
      }}
    >
      {body}
    </section>
  </div>
);
