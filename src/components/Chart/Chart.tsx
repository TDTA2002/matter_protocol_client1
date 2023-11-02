import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import { DateTime } from 'luxon';
import './chart.scss';
import { useSelector } from 'react-redux';
import { StoreType } from '@/store';


const MyChart: React.FC = () => {
  const userStore = useSelector((store: StoreType) => {
    return store.userStore;
  });

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [chartType, setChartType] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    // Hủy biểu đồ hiện tại nếu tồn tại
    if (chartRef.current && "chart" in chartRef.current) {
      (chartRef.current as any).chart.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const labels: Date[] = [];
      const dataValues: any[] = [];

      if (userStore.Chart) {
        userStore.Chart?.forEach((entry) => {
          labels.push(new Date(entry.Date));
          dataValues.push(entry.timestamp);
        });
      }

      const uniqueLabels: Date[] = [];
      const uniqueDataValues: any[] = [];
      let currentInterval: DateTime | undefined = undefined;

      for (let i = 0; i < labels.length; i++) {
        const date = DateTime.fromJSDate(labels[i]);
        let interval: DateTime | undefined;

        if (chartType === 'week') {
          interval = date.startOf('week');
        } else if (chartType === 'month') {
          interval = date.startOf('month');
        } else if (chartType === 'day') {
          interval = date.startOf('day');
        }

        if (currentInterval === undefined || (interval && !currentInterval.hasSame(interval, chartType))) {
          // Bắt đầu một khoảng thời gian mới
          if (interval) {
            currentInterval = interval;
            uniqueLabels.push(interval.toJSDate());
            uniqueDataValues.push(dataValues[i]);
          }
        } else {
          // Cùng một khoảng thời gian, gộp dữ liệu
          uniqueDataValues[uniqueDataValues.length - 1] += dataValues[i];
        }
      }

      const data = {
        labels: uniqueLabels,
        datasets: [
          {
            label: 'Timestamp',
            data: uniqueDataValues,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };

      if (ctx) {
        (chartRef.current as any).chart = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: chartType,
                },
                title: {
                  display: true,
                  text: chartType === 'week' ? 'Tuần' : chartType === 'month' ? 'Tháng' : 'Ngày', // Hiển thị 'Ngày' nếu đang chọn theo ngày
                },
              },
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [chartType, userStore.Chart]);

  return (
    <main>
    <div className="head-title">
        <div className="left">
            <h1>Products</h1>
            <ul className="breadcrumb">
                <li>
                    <a href="#">Device</a>
                </li>
                <li>
                    <i className="bx bx-chevron-right" />
                </li>
                <li>
                    <a className="active" href="#">
                        Chart
                    </a>
                </li>
            </ul>
        </div>
    </div>

    <div className="table-data">
        <div className="order">
            <div className="head">
                <h3>Chart</h3>  
            </div>
            <div className='chart-container'>
                <button onClick={() => setChartType('day')}  className="chart-button">Day</button>
                <button onClick={() => setChartType('week')}  className="chart-button">Week</button>
                <button onClick={() => setChartType('month')}  className="chart-button">Month</button>
            </div>
            <div className="chart">
                <canvas ref={chartRef} width={200} height={80} />
            </div>
        </div>
    </div>
</main >
  );
};

export default MyChart;
