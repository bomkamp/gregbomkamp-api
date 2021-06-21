import { NextFunction, Request, Response } from 'express';

export interface errorEjsProps {
  status: number;
  statusDescription: string;
}

/**
 * 404 catch all route for anything undefined.
 */
export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).render('error', {
    status: 404,
    statusDescription: `${req.path} was not found`,
  });
};

/**
 * Catch any uncaught exceptions
 */
export const exceptionMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err.status) {
    res
      .status(err.status)
      .render('error', { status: err.status, statusDescription: err.message });
  } else {
    res.status(500).render('error', {
      status: 500,
      statusDescription:
        'An error occurred :( Please try again later or let me know!' +
        (err.message ? `<br/><small>Error: ${err.message}</small>` : ''),
    });
  }
};
