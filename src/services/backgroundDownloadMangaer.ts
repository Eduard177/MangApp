const downloadQueue: (() => Promise<void>)[] = [];
let isDownloading = false;

export function queueDownload(task: () => Promise<void>): Promise<void> {
  return new Promise((resolve) => {
    downloadQueue.push(async () => {
      await task();
      resolve();
    });
    if (!isDownloading) runQueue();
  });
}

async function runQueue() {
  isDownloading = true;
  while (downloadQueue.length > 0) {
    const task = downloadQueue.shift();
    if (task) await task();
  }
  isDownloading = false;
}
