interface PageTitleProps {
  title: string;
  subtitle: string;
  titleClassName?: string;
  className?: string;
}

const PageTitle = ({
  title,
  subtitle,
  titleClassName,
  className,
}: PageTitleProps) => {
  return (
    <div className={`space-y-1 sm:space-y-2 ${className}`}>
      <h1
        className={`text-lg lg:text-3xl font-bold leading-[1.9rem] text-white ${titleClassName}`}>
        {title}
      </h1>
      <p className="font-normal text-primary-200 line-clamp-2 leading-5 text-xs sm:text-sm w-[85%] lg:w-full">
        {subtitle}
      </p>
    </div>
  );
};

export default PageTitle;
