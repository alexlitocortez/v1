import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useAppContext } from '~/context';
import { number } from 'zod';

Chart.register(...registerables);

interface dataprops {
    label: string,
    data: number[],
    fill: boolean,
    backgroundColor: string,
    borderColor: string
    // pointBackgroundColor: string
}

interface ChartData {
    labels: string[],
    datasets: dataprops[]
}


const LineChart = () => {
    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: []
    })

    const { nameContext } = useAppContext();

    const values = nameContext.map((item) => item.sale_amount)
    const replaceValues = values.map((item) => item.replace(/[^0-9]/g, ''))
    const newValues = replaceValues.map((item) => parseInt(item))

    console.log("newValues", newValues)

    const calculateAverage = (values: number[]) => {
        const total = values.reduce((acc, curr) => acc + curr, 0);
        return total / values.length;
    };

    const averageValue = calculateAverage(newValues);

    console.log("average value", averageValue)

    const projectTitles = nameContext.map((item) => item.title)

    useEffect(() => {
        const fetchData = () => {
            setChartData({
                labels: projectTitles,
                datasets: [
                    {
                        label: 'Side Hustle Prices',
                        data: newValues,
                        fill: false,
                        backgroundColor: 'rgb(75, 192, 192)',
                        borderColor: 'rgba(75, 192, 192, 0.2)',
                    }
                ],
            })
        }
        fetchData();
    }, [])

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    color: 'white',
                    font: {
                        size: 16,
                    },
                },
                ticks: {
                    color: 'white', // Change tick color
                },
            },
            y: {
                beginAtZero: true,
                min: 500, // Set the minimum value for the Y-axis
                max: 100000, // Set the maximum value for the Y-axis
                ticks: {
                    stepSize: 500, // Set the step size between ticks
                    color: 'white'
                },
                color: 'white', // Change tick color
            },
        },
    }

    return (
        <div className='flex flex-col text-center mt-4'>
            <h1 className='mb-4 font-bold'>Project Prices</h1>
            <Line data={chartData} options={options} />
            <div>
                <h2>Average Value: ${averageValue.toLocaleString()}</h2>
            </div>
        </div>
    );
}



export default LineChart;