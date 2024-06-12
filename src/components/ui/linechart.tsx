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
    const { salesAmountContext, setSalesAmountContext } = useAppContext();

    useEffect(() => {
        const fetchData = () => {
            setChartData({
                labels: ['5,000', '10,000', '15,000', '20,000', '30,000', '40,000', '50,000', '75,000', '100,000'],
                datasets: [
                    {
                        label: 'Side Hustle Prices',
                        data: salesAmountContext,
                        fill: false,
                        backgroundColor: 'rgb(75, 192, 192)',
                        borderColor: 'rgba(75, 192, 192, 0.2)',
                    }
                ]
            })
        }
        fetchData()
    }, [])
}



export default LineChart;