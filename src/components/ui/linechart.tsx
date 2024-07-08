import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useAppContext } from '~/context';

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

    const projectTitles = nameContext.map((item) => item.title)


    console.log("values", newValues)

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
        fetchData()
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
                max: 10000, // Set the maximum value for the Y-axis
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
        </div>
    );
}



export default LineChart;