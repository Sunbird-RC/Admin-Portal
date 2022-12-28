RELEASE_VERSION = v0.0.7-beta
build:
	docker build -t dockerhub/sunbird-rc-admin-portal .

release: build
	docker tag dockerhub/sunbird-rc-admin-portal dockerhub/sunbird-rc-admin-portal:$(RELEASE_VERSION)
	docker push dockerhub/sunbird-rc-admin-portal:latest
	docker push dockerhub/sunbird-rc-admin-portal:$(RELEASE_VERSION)
