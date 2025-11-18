import cluster from 'node:cluster';
import os from 'node:os';
import process from 'node:process';

if (cluster.isPrimary) {
    const numWorkers = Math.min(os.availableParallelism(), 20);
    for (let i = 0; i < numWorkers; i++) cluster.fork();
} else {
    await import('./server');
    console.log(`Worker ${process.pid} started`);
}
