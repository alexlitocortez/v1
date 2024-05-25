import React from 'react';
import Box from '@mui/material/Box';
import MaxWidthWrapper from '~/components/ui/Othercomponents/MaxWidthWrapper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material';
import { Typography } from '@mui/material';
import { Button } from '~/components/ui/button';
import Grid from '@mui/material/Grid';
import CheckIcon from '@mui/icons-material/Check';

const page = () => {
    return (
        <MaxWidthWrapper>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="stretch"
                minHeight="100vh"
            >
                <Box>
                    <p className='mt-5 mb-5 font-bold md:text-3xl max-w-prose text-zinc-700 sm:text-lg'>
                        Pricing
                    </p>
                    <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
                        Save hours of research and find your <span className="text-blue-600">opportunity</span>.
                    </h1>
                </Box>
                <Grid container spacing={2} className='mt-3'>
                    <Grid item xs={12} md={6}>
                        <Card className='h-full flex flex-col p-5'>
                            <CardContent style={{ flexGrow: 1 }}>
                                <Typography variant='h5' className='mt-3 mb-3'>Starter</Typography>
                                <Typography variant='h2' className='mb-5 font-bold'>$Free.99</Typography>
                                <div className='flex flex-col'>
                                    <div>
                                        <CheckIcon /> View SaaS names
                                    </div>
                                    <div>
                                        <CheckIcon /> See prices
                                    </div>
                                    <div>
                                        <CheckIcon /> See description
                                    </div>
                                </div>
                            </CardContent>
                            <div className='flex'>
                                <Button size='xl' className='m-auto'>Get Side Vision</Button>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card className='h-full flex flex-col p-5'>
                            <CardContent>
                                <Typography variant='h5' className='mt-3 mb-3'>Pro</Typography>
                                <Typography variant='h2' className='mb-5 font-bold'>$4.99/mo</Typography>
                                <div className='flex flex-col'>
                                    <div>
                                        <CheckIcon /> View SaaS names
                                    </div>
                                    <div>
                                        <CheckIcon /> See prices
                                    </div>
                                    <div>
                                        <CheckIcon /> See description
                                    </div>
                                    <div>
                                        <CheckIcon /> Go to buyer page
                                    </div>
                                    <div>
                                        <CheckIcon /> See full listing
                                    </div>
                                </div>
                            </CardContent>
                            <div className='flex flex-col'>
                                <Button size='xl' className='m-auto'>Get Side Vision</Button>
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </MaxWidthWrapper>
    )
}

export default page