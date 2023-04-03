import {motion} from "framer-motion";
import {FC, PropsWithChildren} from "react";

export const AnimatedWrapper: FC<PropsWithChildren> = ({children}) => {
  return (
    <motion.div
      exit={{opacity: 0, height: 0}}
      animate={{opacity: 1, height: "auto"}}
      initial={{opacity: 0, height: 0}}
      layout="position"
      className=" text-white cursor-grab flex  rounded"
    >
      <div className="flex w-full text-slate-200 my-2 overflow-auto">
        {children}
      </div>
    </motion.div>
  );
};
