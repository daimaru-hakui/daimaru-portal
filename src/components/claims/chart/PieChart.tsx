import type { NextPage } from 'next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

type Props = {
  values: any;
  labels: string[];
};

const PieChart: NextPage<Props> = ({ values, labels }) => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const options: {} = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 10,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  const data = {
    labels: [...labels],
    datasets: [
      {
        label: '# of Votes',
        data: [...values],
        backgroundColor: [
          'rgba(235, 83, 83, 0.8)',
          'rgba(249, 217, 35, 0.8)',
          'rgba(54, 174, 124, 0.8)',
          'rgba(24, 116, 152, 0.8)',
          'rgba(189 ,66, 145, 0.8)',
          'rgba(10, 161, 221, 0.8)',
          'rgba(228, 220, 207, 0.8)',
          'rgba(76, 58, 81, 0.8)',
        ],
        borderColor: [
          'rgba(235, 83, 83, 1)',
          'rgba(249, 217, 35, 1)',
          'rgba(54, 174, 124, 1)',
          'rgba(24, 116, 152,1)',
          'rgba(189 ,66, 145, 1)',
          'rgba(10, 161, 221, 1)',
          'rgba(228, 220, 207, 1)',
          'rgba(76, 58, 81, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const divStyle: React.CSSProperties = {
    marginTop: '0',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    width: '400px',
  };
  return (
    <div className='App' style={divStyle}>
      <Pie data={data} options={options} width={300} height={300} />
    </div>
  );
};

export default PieChart;
