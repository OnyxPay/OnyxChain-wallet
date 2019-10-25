FROM yarnpkg/dev AS wallet
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY ./ ./
RUN npm run build

FROM ubuntu:18.04 AS explorer
RUN apt-get update \
    && apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 \
        libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 \
        libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
        libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget npm \
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
RUN wget -O - https://github.com/OnyxPay/onyxchain-explorer-frontend/tarball/10892421924126d44e5b935e5c45ace5add6afe5 | tar -xz --strip-components=1 \
    && npm install && npm run build

FROM nginx:1-alpine
COPY deploy/default.conf /etc/nginx/conf.d/
COPY --from=wallet /usr/src/app/build /var/www/wallet
COPY --from=explorer /usr/src/app/dist /var/www/explorer
ARG tag
RUN if [ "${tag}" = "prod" ] ; then suffix= ; else suffix=preprod- ; fi && sed -i "s/SUFFIX/${suffix}/g" /etc/nginx/conf.d/default.conf
