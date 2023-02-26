import type { Plugin } from 'vite';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { green, blue, bold } from 'picocolors';
import { getPackageSize } from '@pureadmin/utils';
dayjs.extend(duration);

export function viteBuildInfo(): Plugin {
  let config: { command: string };
  let startTime: Dayjs;
  let endTime: Dayjs;
  let outDir: string;
  return {
    name: 'vite:buildInfo',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outDir = resolvedConfig.build?.outDir ?? 'dist';
    },
    buildStart() {
      console.log(bold(green(`欢迎使用：${blue('学籍管理系统')}`)));
      if (config.command === 'build') {
        startTime = dayjs(new Date());
      }
    },
    closeBundle() {
      if (config.command === 'build') {
        endTime = dayjs(new Date());
        getPackageSize({
          folder: outDir,
          callback: (size: string) => {
            console.log(
              bold(
                green(
                  `恭喜打包完成（总用时${dayjs
                    .duration(endTime.diff(startTime))
                    .format('mm分ss秒')}，打包后的大小为${size}）`,
                ),
              ),
            );
          },
        });
      }
    },
  };
}
