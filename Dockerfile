FROM alpine:3.16

LABEL org.opencontainers.image.source=https://github.com/sindbach/flow-executor-nodejs

ENV DRIVER_VERSION 4.8.0
ENV HOME /home/flow
ENV SPACE /workspace

RUN apk add --no-cache nodejs npm
RUN adduser -S flow && \
    chown -R flow ${HOME} && chmod -R 750 ${HOME} && \
    mkdir ${SPACE} && chown -R flow ${SPACE} && chmod -R 750 ${SPACE}
COPY /package.json ./wrapper.js ${HOME}/
RUN cd ${HOME} && \
    npm config set cache ${HOME}/.npm --global && \
    npm install mongodb@${DRIVER_VERSION} --save

USER flow

ENTRYPOINT ["/bin/sh", "-c"]